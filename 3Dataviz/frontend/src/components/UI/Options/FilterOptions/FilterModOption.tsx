function FilterModOptions() {
    return(
        <>
        <div className="filter">
            <p>Scegli l`algoritmo di filtraggio</p>
            <form className="choice-form">
                <div className="option-choise">
                    <input type="radio" id="sup" name="choise" />
                    <label htmlFor="sup">Superiori</label>
                </div>
                <div className="option-choise">
                    <input type="radio" id="inf" name="choise"/>
                    <label htmlFor="inf">Inferiori</label>
                </div>
            </form>
        </div>
        </>
    )
}

export default FilterModOptions