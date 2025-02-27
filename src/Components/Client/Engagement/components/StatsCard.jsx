import { Card, CardActionArea, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#E5ECF6",
  borderRadius: "16px",
  boxShadow: "none",
}));

const StyledCardActionArea = styled(CardActionArea)(({ theme }) => ({
  padding: "24px",
  width: "220px",
  height: "96px",
}));

const StatsCard = ({ title, value, isLoading }) => {
  return (
    <StyledCard>
      <StyledCardActionArea>
        <Typography fontSize={13} sx={{ color: "#4B5563", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontWeight: "600", color: "#111827" }}>
          {isLoading ? <Skeleton width={50} /> : value}
        </Typography>
      </StyledCardActionArea>
    </StyledCard>
  );
};

export default StatsCard;
