import day from "../images/Screenshot 2026-09-04 at 2.30.28 AM.png"
import night from "../images/Kone Bari Client File/PNG/Kone Bari Client File-17.png"

export default function Logo() {
    return (
        <div className="w-28 sm:w-32 object-cover rounded-2xl flex items-center">
      {/* Light Mode Logo (Dark mode-এ hidden থাকবে) */}
      <img
        src={day}
        className="rounded-xl dark:hidden block w-full h-auto object-contain"
        alt="Konebari Logo Light"
      />

      {/* Dark Mode Logo (Light mode-এ hidden থাকবে) */}
      <img
        src={night}
        className="rounded-xl hidden dark:block w-full h-auto object-contain"
        alt="Konebari Logo Dark"
      />
    </div>

    )
}