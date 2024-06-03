interface Props {
    src: string;
    width?: string;
    height?: string;
}

export default function WeatherWidget(props: Props) {
    return <iframe
        height={props.height}
        width={props.width}
        src={props.src}
        //@ts-ignore
        frameborder="0" />
}
