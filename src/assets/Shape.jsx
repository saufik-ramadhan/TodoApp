import * as React from "react"
import Svg, { Path, Ellipse } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */

const Shape = (props) => (
  <Svg width={290} height={230} xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path fill="#469fd1" d="M7 69h278v157H7z" />
    <Ellipse ry={27} rx={75} cy={70} cx={159} fill="#469fd1" />
    <Ellipse ry={54} rx={61.5} cy={65} cx={210.5} fill="#469fd1" />
    <Ellipse ry={57} rx={54.5} cy={58} cx={234.5} fill="#0386d0" />
    <Ellipse ry={56.5} rx={58.5} cy={70.5} cx={59.5} fill="#469fd1" />
  </Svg>
)

export default Shape
