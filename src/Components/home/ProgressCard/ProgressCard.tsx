import Card from "./Card"

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

const ProgressCard = () => {
    return (
        <div className="flex flex-col gap-4">
            {
                listGame.map(({ src, texto }, index) => (
                    <Card key={index} srcimg={src} texto={texto} />
                ))
            }
        </div>
    )
}
export default ProgressCard