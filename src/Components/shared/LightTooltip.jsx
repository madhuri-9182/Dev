import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

// Create the styled component with proper prop forwarding
export const LightTooltip = styled(
  // eslint-disable-next-line no-unused-vars
  ({ className, color, ...props }) => (
    <Tooltip
      {...props}
      classes={{ popper: className }}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
    />
  )
)(({ theme, color = "rgba(0, 0, 0, 0.87)" }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: color, // Use the color prop here
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: 200,
    textAlign: "center",
  },
}));
