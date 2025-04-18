import "./Filter.css"

type FilterProps = {
    title:string,
    description:string,
    children?: React.ReactNode,
    onClick: ()=>void
}
function Filter({title,description,onClick,children}:FilterProps) {
    return(
        <>
        <div className="filter">
            <p>{title}</p>
            {children}
            <button id="filter-btn" title={description} onClick={onClick}>Filtra</button>
        </div>
        </>
    )
}

export default Filter