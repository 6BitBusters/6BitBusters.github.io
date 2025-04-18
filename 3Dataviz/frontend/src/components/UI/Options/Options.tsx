import Filter from "./FilterOptions/Filter"
import FilterModOptions from "./FilterOptions/FilterModOption"
import NFilter from "./FilterOptions/NFilter"
import AveragePlaneOption from "./ViewOptions/PlaneOptions/AveragePlaneOption"
import "./Options.css"
import ExpanderButton from "../Utils/ExpanderButton"

function Options() {
    return(
        <>
        <div id="option-container">
            <ExpanderButton
            id="view-options"
            target="#option-container"
            fromToX={[0,-500]}
            />
            <div id="option-wrap">
                <div id="filter-container">
                    <Filter 
                    title="Filtra i valori superiori o inferiori"
                    description="Esegui un filtraggio i valori superiori o inferiori a quello selezionato"
                    onClick={()=>{}}
                    />
                    <Filter
                    title="Filtra per valor medio globale"
                    description="Esegui un filtraggio rispetto al valore medio globale"
                    onClick={()=>{}}
                    />
                    <NFilter/>
                    <FilterModOptions/>
                    <button id="filter-btn" title="resetta filtri" onClick={()=>{}}>Resetta filtri</button>
                </div>

                <div id="viewoption-container">
                    <AveragePlaneOption/>
                </div>
            </div>
        </div>
        </>
    )
}

export default Options