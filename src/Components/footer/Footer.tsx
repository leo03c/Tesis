import Image from "next/image"
import Link from "next/link"

const Footer = () => {
    return (
        <div className="bg-[#1c2c3b] px-4">
            <div className="max-w-screen-xl mx-auto flex flex-col gap-10">
                {/* Parte superior con logo y redes */}
                <div className="flex flex-col md:flex-row justify-between border-b border-gray-400 py-10">
                    <div className="p-5">
                        <Image width={353} height={88} alt='logo' src={'logo.svg'} />
                    </div>
                    <div className="flex gap-5 p-5 items-center justify-center">
                        <div className="w-8 h-8 flex border border-gray-400 rounded-full items-center justify-center">
                            <Image width={15} height={15} alt='Facebook' src={'f.svg'} />
                        </div>
                        <div className="w-8 h-8 flex border border-gray-400 rounded-full items-center justify-center">
                            <Image width={15} height={15} alt='Twitter' src={'x.svg'} />
                        </div>
                        <div className="w-8 h-8 flex border border-gray-400 rounded-full items-center justify-center">
                            <Image width={15} height={15} alt='Youtube' src={'y.svg'} />
                        </div>
                    </div>
                </div>

                {/* Secciones de enlaces */}
                <div className="flex flex-wrap gap-10 justify-between border-b border-gray-400 py-10 px-5 text-white">
                    <div className="flex flex-col gap-4 min-w-[200px]">
                        <h2 className="text-2xl font-bold">Servicios en línea</h2>
                        <Link href={''}><p>Acuerdo de servicios</p></Link>
                        <Link href={''}><p>Política de uso aceptable</p></Link>
                        <Link href={''}><p>Declaración de confianza</p></Link>
                    </div>
                    <div className="flex flex-col gap-4 min-w-[200px]">
                        <h2 className="text-2xl font-bold">Compañía</h2>
                        <Link href={''}><p>Acerca de</p></Link>
                        <Link href={''}><p>Noticias</p></Link>
                        <Link href={''}><p>Estudiantes</p></Link>
                        <Link href={''}><p>Empleo</p></Link>
                    </div>
                    <div className="flex flex-col gap-4 min-w-[200px]">
                        <h2 className="text-2xl font-bold">Recursos</h2>
                        <Link href={''}><p>Comunidad de desarrolladores</p></Link>
                        <Link href={''}><p>Apoya a un creador</p></Link>
                        <Link href={''}><p>Acuerdo de creador</p></Link>
                        <Link href={''}><p>Reglas de comunidad</p></Link>
                        <Link href={''}><p>Consultas sobre el reglamento</p></Link>
                    </div>
                </div>

                {/* Legal y botón de subir */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 py-10">
                    <div className="flex flex-col gap-5 text-white w-full md:w-[75%]">
                        <p className="text-sm">
                            © 2025, COSMOX. Todos los derechos reservados. COSMOX, el logotipo de COSMOX,
                            son marcas comerciales o marcas registradas de VERTEX, tanto en Cuba como en el resto del mundo.
                            Otras marcas o nombres de productos son marcas comerciales de sus respectivos propietarios.
                            Nuestros sitios web pueden incluir enlaces a otros sitios y recursos ofrecidos por terceros.
                            Estos enlaces solo se ofrecen para tu mayor comodidad. COSMOX no tiene control sobre el contenido de esos sitios y recursos,
                            y no acepta ninguna responsabilidad por ellos ni por cualquier pérdida o daño que pueda ocasionar el uso que haces de ellos.
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <Link href={''}><p>Términos de servicio</p></Link>
                            <Link href={''}><p>Política de privacidad</p></Link>
                            <Link href={''}><p>Seguridad y protección</p></Link>
                            <Link href={''}><p>Política de reembolso</p></Link>
                        </div>
                    </div>

                    <div className="w-full md:w-[25%] flex justify-center md:justify-end">
                        <button className="w-full md:w-[275px] h-[66px] bg-[#283B4C] rounded-lg flex items-center justify-center text-white">
                            <p className="flex gap-2 items-center text-sm">
                                VOLVER AL PRINCIPIO
                                <Image width={15} height={15} alt='up' src={'up.svg'} />
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;
