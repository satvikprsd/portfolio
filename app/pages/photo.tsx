import Image from "next/image"
import mypic from "../pfp1.jpg"
export default function Photo(){
    return(
        <div className="myphoto postloader box relative left-0 top-0 z-20 aspect-square h-full w-full translate-x-0 translate-y-0 transform bg-secondary">
            <Image className="rounded-[16px]" src={mypic} fill objectFit="cover" alt="logo" />
        </div>
    )
}