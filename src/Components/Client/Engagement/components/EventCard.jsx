/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { Card, CardActionArea, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ItemTypes } from "../constants";
import { useDrag } from "react-dnd";
import { EditOutlined } from "@mui/icons-material";
import React, { useState } from "react";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  padding: "0",
  width: "100%",
  position: "relative",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
}));

const StyledCardActionArea = styled(CardActionArea)(({ theme }) => ({
  width: "100%",
  height: "64px",
  padding: "12px",
  overflow: "hidden",
}));

const EventCard = React.memo(
  ({
    title,
    selected,
    isDragging,
    dimension,
    onClick = () => {},
    onChange = () => {},
    isEditable = true,
    autoFocus = false,
    onBlur = () => {},
    template,
  }) => {
    const [edit, setEdit] = useState(!!autoFocus);

    return (
      <StyledCard
        sx={{
          mb: dimension ? 0 : 2,
          ...(selected
            ? {
                color: "white",
                backgroundColor: "#007AFF",
              }
            : {
                color: "#65558F",
                backgroundColor: "white",
                border: "1px solid #79747E",
              }),
        }}
      >
        {!edit && isEditable ? (
          <IconButton
            style={{
              position: "absolute",
              right: "4px",
              top: "4px",
              color: "white",
              fontSize: "14px",
              zIndex: 5,
            }}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setEdit(true);
            }}
          >
            <EditOutlined fontSize="inherit" />
          </IconButton>
        ) : null}

        <StyledCardActionArea
          disableRipple={isDragging}
          style={{ cursor: isDragging ? "move" : "pointer", ...dimension }}
          onClick={() => !selected && onClick(template)}
        >
          {edit ? (
            <textarea
              type="text"
              value={title}
              className="border-none h-full w-full color-white bg-transparent text-default outline-none"
              autoFocus
              onBlur={() => {
                setEdit(false);
                onBlur();
              }}
              rows={2}
              // defaultValue={title}
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          ) : (
            <Typography
              fontSize={13}
              sx={{
                display: "-webkit-box",
                fontWeight: 700,
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center",
              }}
            >
              {title}
            </Typography>
          )}
        </StyledCardActionArea>
      </StyledCard>
    );
  }
);

export const DraggableEventCard = React.memo(({ title, selected, index }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EVENT_CARD,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      role="handle"
      style={{ opacity: isDragging ? 0.5 : 1, height: "max-content" }}
      className="cursor-move"
    >
      <EventCard title={title} isDragging={true} selected={selected} />
    </div>
  );
});

export default EventCard;
