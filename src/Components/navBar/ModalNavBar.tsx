// import PropTypes from "prop-types";
// import Image from "next/image";     
// import React from "react";
// import { Bag2 } from "./Bag2";
// import { Bag2_1 } from "./Bag2_1";
// import { Game } from "./Game";
// import { Heart } from "./Heart";
// import { Heart1 } from "./Heart1";
// import { IconComponentNode } from "./IconComponentNode";
// import image from "./image.svg";
// import rectangle1012 from "./rectangle-101-2.svg";
// import rectangle1013 from "./rectangle-101-3.svg";
// import rectangle101 from "./rectangle-101.svg";

// interface Props {
//   propiedad1:
//     | "men-inferior-perfil"
//     | "men-inferior-me-gustan"
//     | "men-inferior-tienda"
//     | "men-inferior-carrito"
//     | "predeterminado";
//   className: any;
//   rectangle: string;
// }

// export const MenInferior = ({
//   propiedad1,
//   className,
//   rectangle = "rectangle-101-4.svg",
// }: Props): JSX.Element => {
//   return (
//     <div
//       className={`w-80 flex items-start shadow-[7px_2px_17px_#00000026,29px_9px_31px_#00000021,66px_20px_41px_#00000014,117px_36px_49px_#00000005,183px_56px_54px_transparent] justify-between relative ${className}`}
//     >
//       <div className="w-[231px] flex items-start p-2 rounded-[20px] justify-between bg-azul-medianoche-contenedores relative">
//         <div
//           className={`inline-flex items-center gap-2.5 flex-[0_0_auto] p-3 rounded-[10px] justify-center relative ${propiedad1 === "men-inferior-tienda" ? "bg-[#283b4c]" : ""}`}
//         >
//           {propiedad1 === "men-inferior-tienda" && (
//             <IconComponentNode className="!relative !w-[60px] !h-[60px] !mt-[-18.00px] !mb-[-18.00px] !ml-[-18.00px] !mr-[-18.00px]" />
//           )}

//           {[
//             "men-inferior-carrito",
//             "men-inferior-me-gustan",
//             "men-inferior-perfil",
//             "predeterminado",
//           ].includes(propiedad1) && <Game className="!relative !w-6 !h-6" />}
//         </div>

//         <div
//           className={`inline-flex items-center gap-2.5 flex-[0_0_auto] p-3 rounded-[10px] justify-center relative ${propiedad1 === "men-inferior-me-gustan" ? "bg-[#283b4c]" : ""}`}
//         >
//           {[
//             "men-inferior-carrito",
//             "men-inferior-perfil",
//             "men-inferior-tienda",
//             "predeterminado",
//           ].includes(propiedad1) && <Heart className="!relative !w-6 !h-6" />}

//           {propiedad1 === "men-inferior-me-gustan" && (
//             <Heart1 className="!relative !w-[60px] !h-[57.8px] !mt-[-16.90px] !mb-[-16.90px] !ml-[-18.00px] !mr-[-18.00px]" />
//           )}
//         </div>

//         <div
//           className={`inline-flex items-center gap-2.5 flex-[0_0_auto] p-3 rounded-[10px] justify-center relative ${propiedad1 === "men-inferior-carrito" ? "bg-[#283b4c]" : ""}`}
//         >
//           {[
//             "men-inferior-me-gustan",
//             "men-inferior-perfil",
//             "men-inferior-tienda",
//             "predeterminado",
//           ].includes(propiedad1) && <Bag2 className="!relative !w-6 !h-6" />}

//           {propiedad1 === "men-inferior-carrito" && (
//             <Bag2_1 className="!relative !w-[57.69px] !h-[60px] !mt-[-18.00px] !mb-[-18.00px] !ml-[-16.84px] !mr-[-16.84px]" />
//           )}
//         </div>
//       </div>

//       <div
//         className={`inline-flex items-start gap-4 flex-[0_0_auto] p-2 rounded-[20px] relative ${propiedad1 === "men-inferior-perfil" ? "bg-[#283b4c]" : "bg-azul-medianoche-contenedores"}`}
//       >
//         <img
//           className={`object-cover relative ${propiedad1 === "men-inferior-perfil" ? "w-[88px]" : "w-12"} ${propiedad1 === "men-inferior-perfil" ? "mt-[-20.00px]" : ""} ${propiedad1 === "men-inferior-perfil" ? "mr-[-20.00px]" : ""} ${propiedad1 === "men-inferior-perfil" ? "ml-[-20.00px]" : ""} ${propiedad1 === "men-inferior-perfil" ? "h-[88px]" : "h-12"} ${propiedad1 === "men-inferior-perfil" ? "mb-[-20.00px]" : ""}`}
//           alt="Rectangle"
//           src={
//             propiedad1 === "men-inferior-me-gustan"
//               ? image
//               : propiedad1 === "men-inferior-carrito"
//                 ? rectangle1012
//                 : propiedad1 === "men-inferior-perfil"
//                   ? rectangle1013
//                   : propiedad1 === "predeterminado"
//                     ? rectangle
//                     : rectangle101
//           }
//         />
//       </div>
//     </div>
//   );
// };

// MenInferior.propTypes = {
//   propiedad1: PropTypes.oneOf([
//     "men-inferior-perfil",
//     "men-inferior-me-gustan",
//     "men-inferior-tienda",
//     "men-inferior-carrito",
//     "predeterminado",
//   ]),
//   rectangle: PropTypes.string,
// };
