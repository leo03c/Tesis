import Image from "next/image"

interface ICardProps {
    srcimg:string,
    texto:string
}

const Card = ({srcimg, texto}:ICardProps) => {

    const srcImag = srcimg;
    const textodesc = texto;

    return (
        <div className="w-[263] h-[84] flex justify-start items-center gap-5 text-white p-2 bg-[#1C2C3B] rounded-4xl">
            <div is="cardimg"><Image src={srcImag} alt="LOL" width={67} height={70} /> </div>
            <label htmlFor="cardimg">{textodesc}</label>
        </div>
    )
}
export default Card