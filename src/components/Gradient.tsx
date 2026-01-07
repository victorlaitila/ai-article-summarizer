import Lottie from "lottie-react";
import gradient from "../animations/gradient.json";

export default function Gradient() {
  return <Lottie animationData={gradient} loop={true} className="w-9 h-9 [@media(min-width:500px)]:w-12.5 [@media(min-width:500px)]:h-12.5" />;
}