import Chance from 'chance'

const chance = new Chance();

type Props = {
    lines?: number|undefined;
    circles?: number|undefined;
    triangles?: number|undefined;
    opacity?: number|undefined;
    max_size?: number|undefined;
    background?: any;
}

type LineProps = {
    opacity: number;
    strokeWidth: number;
    strokeColor: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

const Line = ({opacity, strokeWidth, strokeColor, x1, y1, x2, y2}: LineProps) => {
        return(
            <line stroke={strokeColor}
                stroke-width={strokeWidth}
                opacity={opacity}
                x1={x1} y1={y1} x2={x2} y2={y2} />
        )
}

type CircleProps = {
    cx: number;
    cy: number;
    r: number;
    opacity: number;
    fill: string;
}

const Circle = ({cx, cy, r, opacity, fill}: CircleProps) => {
    return (
        <circle cx={cx} cy={cy} r={r} opacity={opacity} fill={fill}></circle>
    )
}

type TriangleProps = {
    fill: string;
    opacity: number;
    x: number;
    y: number;
    s: number;
}

const Triangle = ({fill, opacity, x, y, s}: TriangleProps) => {
    return(
        <polygon points={x+","+y+" "+(x + chance.integer({min:-s, max:s})) +
            (y + chance.integer({min:-s, max:s})) + (x + chance.integer({min:-s, max:s}))+(y + chance.integer({min:-s, max:s}))}
            opacity={opacity} fill={fill} />
    )
}

export default function RandomImage({lines, circles, triangles, opacity, max_size, background}: Props) {

    max_size = max_size || 30;
    lines = lines || 20;
    circles = circles || 10;
    triangles = triangles || 10;
    opacity = opacity || 0.3;
    background = background || chance.color();

    const min = -50;
    const max = 50;

    let lineElements: LineProps[] = [];
    for (let i =0; i < lines; i++) {
        lineElements[i] = {
            strokeWidth: chance.integer({min: min, max: max}),
            opacity: opacity,
            strokeColor: chance.color(),
            x1: chance.integer({min: min, max: max}),
            x2: chance.integer({min: min, max: max}),
            y1: chance.integer({min: min, max: max}),
            y2: chance.integer({min: min, max: max})
        }
    }

    let circleElements: CircleProps[] = [];
    for(let i=0; i < circles; i++) {
        circleElements[i] = {
            cx: chance.integer({min: min, max: max}),
            cy: chance.integer({min: min, max: max}),
            r: chance.integer({min: 1, max: (max_size/2)}),
            opacity: opacity,
            fill: chance.color()
        }
    }

    let triangleElements: TriangleProps[] = [];
    for(let i=0; i < triangles; i++) {
        triangleElements[i] = {
            s: max_size,
            x: chance.integer({min: min, max: max}),
            y: chance.integer({min: min, max: max}),
            fill: chance.color(),
            opacity: opacity
        }
    }


    // Generate the actual svg
    // Docs: developer.mozilla.org/en-US/docs/Web/SVG/Element/line
    // viewBox use: stackoverflow.com/q/17498855
    return (
        <svg version="1.1" viewBox={"0 0 " + max + " " + max}
             xmlns="http://www.w3.org/2000/svg"
             color={background}
        >
            {lineElements.map((value: LineProps, key: number) => {
                return (
                    <Line {...value}></Line>
                )
            })}

            {circleElements.map((value: CircleProps, key: number) => {
                return (
                <Circle {...value}></Circle>
                )
            })}

            {triangleElements.map((value: TriangleProps, key: number) => {
                return (
                    <Triangle {...value}></Triangle>
                )
            })}
        </svg>
    )
}