import Filter from "./Filter"

function NFilter() {
    return(
        <>
            <Filter
            title="Filtra i valori Top e Bottom"
            description="Esegui un filtraggio dei top e bottom N"
            onClick={()=>{}}
            >
                <input type="number" min={0}/>
            </Filter>
        </>
    )
}

export default NFilter