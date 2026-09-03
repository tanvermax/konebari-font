import logo from "../images/Screenshot 2026-09-04 at 2.30.28 AM.png"

export default function Logo() {
    return (
        <div className="w-30 object-cover rounded-2xl ">
          <img src={logo} className="rounded-xl" alt="" />
        </div>

    )
}