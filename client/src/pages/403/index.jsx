import { Link } from "react-router-dom";
import anh403 from "../../assets/images/403.png";
export default function NotAuthen() {
  return (
    <div class="h-screen w-screen bg-white">
      <div class="max-w-full flex justify-center items-center h-screen">
        <img
          src={anh403}
          class="max-w-full flex justify-center"
          style={{ height: 570, marginTop: -40 }}
          alt="Page not found"
        />
      </div>
      <div class="text-center " style={{ marginTop: -60 }}>
        <Link
          style={{ textDecoration: "none" }}
          to={"/home"}
          class="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white transition-all duration-400 border border-transparent rounded-lg focus:outline-none bg-orange-500"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
