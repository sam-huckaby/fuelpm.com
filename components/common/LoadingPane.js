export default function LoadingPane(props) {
    if (props.loading) {
        return <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-row justify-center items-center text-2xl bg-stone-700/50 text-white dark:bg-white/30">Loading...</div>;
    } else {
        return <></>;
    }
}