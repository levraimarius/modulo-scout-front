import { TailSpin } from "react-loader-spinner";

export default function Loading() {
    return (
        <div className="test">
            <TailSpin
                height="100"
                width="100"
                color="#0b5ed7"
                ariaLabel="Chargement ..."
            />
            <p className="text-primary mt-3">Chargement ...</p>
        </div>
    )
}