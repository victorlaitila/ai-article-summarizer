import Lottie from "lottie-react";
import gradient from "../animations/gradient.json";

export default function Gradient() {
  return <Lottie animationData={gradient} loop={true} style={{ width: 50, height: 50 }} />;
}