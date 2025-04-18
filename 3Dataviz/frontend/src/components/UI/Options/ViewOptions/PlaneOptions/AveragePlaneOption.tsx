function AveragePlaneOption() {
    return(
        <>
        <div className="view">
            <p>Visualizza piano medio globale</p>
            <form className="choice-form">
                <div className="option-choise">
                    <input type="radio" id="plane-active" name="choise"/>
                    <label htmlFor="plane-active">Abilitato</label> 
                </div>
                <div className="option-choise">
                    <input type="radio" id="plane-inactive" name="choise"/>
                    <label htmlFor="plane-inactive">Disabilitato</label>
                </div>
            </form>
        </div>
        </>
    )
}

export default AveragePlaneOption