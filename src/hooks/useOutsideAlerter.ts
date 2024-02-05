import { useEffect, useState } from "react"

export default function useOutsideAlerter(ref: any) {

    const [isOutside, setIsOutside] = useState(false)

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                return setIsOutside(true)
            }
            return setIsOutside(false)
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return isOutside
}