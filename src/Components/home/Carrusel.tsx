import Image from "next/image";
import ProgressCard from "./ProgressCard/ProgressCard";

const Carrusel = () => {
    return (
        <div className="flex justify-between gap-5">
            {/* Tarjeta principal */}
            <div className="bg-[url(/images/bg-game1.svg)] bg-cover bg-center w-[799px] h-[483px] rounded-2xl">
                <div className="flex justify-between items-center m-5">
                    <div className="flex gap-5 text-white">
                        <label className="w-[121px] h-[28px] text-center bg-white/30 rounded-lg leading-[28px]">AVENTURA</label>
                        <label className="w-[47px] h-[28px] text-center bg-white/30 rounded-lg leading-[28px]">RPG</label>
                    </div>
                    <div className="w-[56px] h-[56px] flex justify-center items-center bg-[#283B4C] rounded-2xl">
                        <Image src={'/heart-red.svg'} alt="Heart Red" width={24} height={24} />
                    </div>
                </div>
                <div className="flex flex-col gap-5 mt-[20%] m-5">
                    <label className="text-2xl font-bold text-white">LEAGUE OF LEGENDS</label>
                    <p className="w-[55%] text-white">
                        Conviértete en una leyenda. Encuentra a tu campeón, domina
                        sus habilidades y supera a tus oponentes en una épica batalla
                        de 5 contra 5 para destruir la base enemiga.
                    </p>
                    <button className="w-[177px] h-[62px] text-white bg-[#2993FA] rounded-md">DESCARGAR</button>
                </div>
            </div>

            {/* Tarjeta secundaria con detalles */}
            <div className="w-[413px] h-[483px] px-8 py-10 bg-[#1C2C3B] rounded-2xl flex flex-col justify-between">
                <div className="flex flex-col gap-5">
                    <p className="text-white">
                        Detalles de funcionalidad del videojuego en
                        cuestión, así como requisitos mínimos de
                        funcionamiento e información complementaria del
                        sistema en el que opera...
                    </p>
                    <div className="flex items-center gap-2">
                        {Array(5).fill(0).map((_, i) => (
                            <Image key={i} width={24} height={24} src={'/Star.svg'} alt="star" />
                        ))}
                        <label className="font-bold text-white">5.0</label>
                    </div>
                    <div className="flex gap-3 items-baseline">
                        <label className="text-2xl font-bold text-white">$44.99</label>
                        <label className="line-through text-white">$59.99</label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <Image
                            width={188}
                            height={174}
                            className="rounded-xl object-cover w-full h-auto"
                            src={'/images/miniCard1.svg'}
                            alt="Mini Card 1"
                        />
                    </div>
                    <div className="w-1/2">
                        <Image
                            width={188}
                            height={174}
                            className="rounded-xl object-cover w-full h-auto"
                            src={'/images/miniCard2.svg'}
                            alt="Mini Card 2"
                        />
                    </div>
                </div>
            </div>

            {/* Tarjeta con progreso */}
            <div className="w-[263px] h-[483px]">
                <ProgressCard />
            </div>
        </div>
    );
};

export default Carrusel;
