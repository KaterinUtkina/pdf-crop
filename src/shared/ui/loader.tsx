export function Loader({className}: {className?: string}) {
    return (
        <div className={`w-full h-full flex items-center justify-center ${className ?? ''}`}>
           <span className={"animate-spin block w-16 h-16 rounded-full border-solid border-8 border-gray-300 border-b-sky-500"}></span>
        </div>
    )
}