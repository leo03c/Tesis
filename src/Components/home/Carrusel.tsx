import Image from "next/image";

const listGame = [
    {
        src: '/carruselimg/LOL.svg',
        texto: 'LEAGUE OF LEGENDS'
    },
    {
        src: '/carruselimg/GOW.svg',
        texto: 'GOD OF WAR'
    },
    {
        src: '/carruselimg/CBP.svg',
        texto: 'CYBERPUNK 2077'
    },
    {
        src: '/carruselimg/Control.svg',
        texto: 'CONTROL'
    },
    {
        src: '/carruselimg/HL.svg',
        texto: 'HOGWARTS LEGACY'
    },
]

interface ICardProps {
  srcimg: string;
  texto: string;
}

const Card = ({ srcimg, texto }: ICardProps) => {
  return (
    <div className="w-full min-w-[200px] max-w-[263px] h-[70px] md:h-[84px] flex items-center gap-3 md:gap-4 p-2 md:p-3 bg-[#1C2C3B] rounded-2xl md:rounded-3xl text-white hover:bg-[#283B4C] transition-colors">
      <div className="relative w-[50px] h-[50px] md:w-[67px] md:h-[70px] flex-shrink-0">
        <Image 
          src={srcimg} 
          alt={texto} 
          fill
          className="object-cover rounded-lg md:rounded-xl"
          sizes="(max-width: 768px) 50px, 67px"
        />
      </div>
      <span className="text-xs md:text-sm font-medium truncate pr-2">{texto}</span>
    </div>
  );
};
const Carrusel = () => {
    return (
        <div className="flex flex-col lg:flex-row  gap-4 lg:gap-5 w-full">
            {/* Tarjeta principal */}
            <div className="relative w-full lg:w-[50%] aspect-[1.65] bg-[url(/images/bg-game1.svg)] bg-cover bg-center rounded-2xl">
                <div className="flex justify-between items-center p-4 lg:p-5 absolute top-0 w-full">
                    <div className="flex gap-3 lg:gap-5 text-white">
                        <span className="px-4 py-1 text-sm lg:text-base text-center bg-white/30 rounded-lg">AVENTURA</span>
                        <span className="px-3 py-1 text-sm lg:text-base text-center bg-white/30 rounded-lg">RPG</span>
                    </div>
                    <div className="w-10 h-10 lg:w-14 lg:h-14 flex justify-center items-center bg-[#283B4C] rounded-2xl">
                        <Image src={'/heart-red.svg'} alt="Heart Red" width={24} height={24} />
                    </div>
                </div>
                <div className="flex flex-col gap-3 lg:gap-5 absolute bottom-5 lg:bottom-8 left-5 lg:left-8">
                    <h2 className="text-xl lg:text-2xl font-bold text-white">LEAGUE OF LEGENDS</h2>
                    <p className="w-full lg:w-[55%] text-white text-sm lg:text-base">
                        Conviértete en una leyenda. Encuentra a tu campeón, domina
                        sus habilidades y supera a tus oponentes en una épica batalla
                        de 5 contra 5 para destruir la base enemiga.
                    </p>
                    <button className="w-40 lg:w-44 h-12 lg:h-14 text-white bg-[#2993FA] rounded-md text-sm lg:text-base">
                        DESCARGAR
                    </button>
                </div>
            </div>

            {/* Contenedor secundario */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 w-full lg:w-[35%]">
                {/* Tarjeta secundaria con detalles */}
                <div className="w-full lg:w-[74%] p-6 lg:p-8 bg-[#1C2C3B] rounded-2xl flex flex-col justify-between">
                    <div className="flex flex-col gap-4 lg:gap-5">
                        <p className="text-white text-sm lg:text-base">
                            Detalles de funcionalidad del videojuego en
                            cuestión, así como requisitos mínimos de
                            funcionamiento e información complementaria del
                            sistema en el que opera...
                        </p>
                        <div className="flex items-center gap-2">
                            {Array(5).fill(0).map((_, i) => (
                                <Image key={i} width={20} height={20} src={'/Star.svg'} alt="star" />
                            ))}
                            <span className="font-bold text-white">5.0</span>
                        </div>
                        <div className="flex gap-3 items-baseline">
                            <span className="text-xl lg:text-2xl font-bold text-white">$44.99</span>
                            <span className="line-through text-white">$59.99</span>
                        </div>
                    </div>

                    <div className="flex gap-3 lg:gap-4 mt-4 lg:mt-5">
                        <div className="w-1/2 aspect-[1.08] relative">
                            <Image
                                fill
                                className="rounded-xl object-cover"
                                src={'/images/miniCard1.svg'}
                                alt="Mini Card 1"
                            />
                        </div>
                        <div className="w-1/2 aspect-[1.08] relative">
                            <Image
                                fill
                                className="rounded-xl object-cover"
                                src={'/images/miniCard2.svg'}
                                alt="Mini Card 2"
                            />
                        </div>
                    </div>
                </div>

                {/* Tarjeta con progreso */}
                <div className="w-full lg:w-[15%]">
                    <div className="flex flex-col gap-3 w-full">
                    {listGame.map(({ src, texto }, index) => (
                    <Card key={index} srcimg={src} texto={texto} />
                 ))}
                </div>
            </div>
        </div>
</div>)
}
export default Carrusel;