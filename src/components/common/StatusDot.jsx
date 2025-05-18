import { getStatusColor } from "@/constants";
import { Dot } from ".";

const StatusDot = ({ status, className, ...other }) => {
  return <Dot className={className} variant={getStatusColor(status)} {...other} />;
};

export default StatusDot;
