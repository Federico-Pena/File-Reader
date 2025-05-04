import './Background.css'
export const Background = () => (
  <svg
    className="background"
    viewBox="1 1 100 100"
    preserveAspectRatio="none"
    width="140%"
    height="140%"
  >
    <defs>
      <linearGradient
        gradientTransform="rotate(-176, 0.5, 0.5)"
        x1="50%"
        y1="0%"
        x2="50%"
        y2="100%"
        id="gggrain-gradient2"
      >
        <stop stopColor="hsla(0, 0%, 4%, 1.00)" stopOpacity="1" offset="-0%"></stop>
        <stop stopColor="rgba(255,255,255,0)" stopOpacity="0" offset="100%"></stop>
      </linearGradient>
      <linearGradient
        gradientTransform="rotate(176, 0.5, 0.5)"
        x1="50%"
        y1="0%"
        x2="50%"
        y2="100%"
        id="gggrain-gradient3"
      >
        <stop stopColor="hsl(0, 0%, 0%)" stopOpacity="1"></stop>
        <stop stopColor="rgba(255,255,255,0)" stopOpacity="0" offset="100%"></stop>
      </linearGradient>
      <filter
        id="gggrain-filter"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        filterUnits="objectBoundingBox"
        primitiveUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.16"
          numOctaves="2"
          seed="2"
          stitchTiles="stitch"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          result="turbulence"
        ></feTurbulence>
        <feColorMatrix
          type="saturate"
          values="0"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          in="turbulence"
          result="colormatrix"
        ></feColorMatrix>
        <feComponentTransfer
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          in="colormatrix"
          result="componentTransfer"
        >
          <feFuncR type="linear" slope="3"></feFuncR>
          <feFuncG type="linear" slope="3"></feFuncG>
          <feFuncB type="linear" slope="3"></feFuncB>
        </feComponentTransfer>
        <feColorMatrix
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          in="componentTransfer"
          result="colormatrix2"
          type="matrix"
          values="1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 25 -17"
        ></feColorMatrix>
      </filter>
    </defs>
    <g>
      <rect width="100%" height="100%" fill="hsl(0, 0%, 0%)"></rect>
      <rect width="100%" height="100%" fill="url(#gggrain-gradient3)"></rect>
      <rect width="100%" height="100%" fill="url(#gggrain-gradient2)"></rect>
      <rect
        width="100%"
        height="100%"
        fill="transparent"
        filter="url(#gggrain-filter)"
        opacity="0.72"
        style={{ mixBlendMode: 'overlay' }}
      ></rect>
    </g>
  </svg>
)
