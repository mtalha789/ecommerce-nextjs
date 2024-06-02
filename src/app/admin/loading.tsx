import { Loader2 } from "lucide-react";

export default function Loader(){
    return(
        <div className="flex justify-center">
            <Loader2 className="animate-spin size-24"/>
        </div>
    )
}