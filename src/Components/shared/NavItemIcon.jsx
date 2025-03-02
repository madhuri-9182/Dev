import PropTypes from "prop-types";

export const NavItemIcon = ({ icon: Icon, isActive }) => {
  const getVariant = (isActive) =>
    isActive ? "Bold" : "Linear";

  const getIconColor = (isActive) =>
    isActive ? "#056ddc" : "#000";
  const variant = getVariant(isActive);
  const color = getIconColor(isActive);

  return <Icon variant={variant} color={color} size={18} />;
};

NavItemIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  isActive: PropTypes.bool,
};
