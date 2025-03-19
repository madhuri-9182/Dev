import { Card, CardActionArea, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

const StyledCard = styled(Card)(() => ({
  backgroundColor: "#E5ECF6",
  borderRadius: "16px",
  boxShadow: "none",
}));

const StyledCardActionArea = styled(CardActionArea)(() => ({
  padding: "24px",
  width: "220px",
  height: "96px",
}));

const StatsCard = ({ title, value }) => {
  return (
    <StyledCard>
      <StyledCardActionArea>
        <Typography fontSize={12} sx={{ color: "#4B5563", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontWeight: "600", color: "#111827" }}>
          {typeof value === "number" ? value : <Skeleton width={40} />}
        </Typography>
      </StyledCardActionArea>
    </StyledCard>
  );
};

export default StatsCard;

StatsCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.any,
};
