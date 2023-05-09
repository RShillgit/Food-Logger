import '../styles/nutritionFacts.css';

const NutritionFacts = (props) => {
    return (
        <div className="nutritionFacts">

            <div className="title">
                <h1>Nutrition Facts</h1>
            </div>

            <div className="servings">
                <p>Serving</p>
                <p>{props.quantity} {props.measurement}</p>
            </div>

            <div className="calories">
                <p>Calories</p>
                <p>{props.facts.calories}</p>
            </div>

            <div className='mainNutrients'>

                <p className='title'>% Daily Value*</p>

                <div className='stat'>
                    <div className='left'>
                        <p className='emphasized'>Total Fat</p>
                        <p>5g</p>
                    </div>
                    <div className='right'>
                        <p className='emphasized'>10</p>
                        <p>%</p>
                    </div>
                </div>

                <div className='stat'>
                    <div className='left indented'>
                        <p>Saturated Fat</p>
                        <p>1g</p>
                    </div>
                    <div className='right'>
                        <p className='emphasized'>20</p>
                        <p>%</p>
                    </div>
                </div>

                <div className='stat'>
                    <div className='left indented'>
                        <p>Trans Fat</p>
                        <p>0g</p>
                    </div>
                </div>

                <div className='stat'>
                    <div className='left indented'>
                        <p>Polyunsaturated Fat</p>
                        <p>0g</p>
                    </div>
                </div>

                <div className='stat'>
                    <div className='left indented'>
                        <p>Monounsaturated Fat</p>
                        <p>0g</p>
                    </div>
                </div>

                <div className='stat'>
                    <div className='left'>
                        <p className='emphasized'>Cholesterol</p>
                        <p>0mg</p>
                    </div>
                    <div className='right'>
                        <p className='emphasized'>0</p>
                        <p>%</p>
                    </div>
                </div>

                <div className='stat'>
                    <div className='left'>
                        <p className='emphasized'>Sodium</p>
                        <p>700mg</p>
                    </div>
                    <div className='right'>
                        <p className='emphasized'>20</p>
                        <p>%</p>
                    </div>
                </div>

                <div className='stat'>
                    <div className='left'>
                        <p className='emphasized'>Total Carbohydrate</p>
                        <p>38g</p>
                    </div>
                    <div className='right'>
                        <p className='emphasized'>13</p>
                        <p>%</p>
                    </div>
                </div>

                <div className='stat'>
                    <div className='left indented'>
                        <p>Dietary Fiber</p>
                        <p>10g</p>
                    </div>
                    <div className='right'>
                        <p className='emphasized'>40</p>
                        <p>%</p>
                    </div>
                </div>

                <div className='stat sugar'>
                    <div className='left'>
                        <p>Total Sugars</p>
                        <p>3g</p>
                    </div>
                </div>

                <div className='stat addedSugar'>
                    <div className='left'>
                        <p>Includes 2g Added Sugars</p>
                    </div>
                    <div className='right'>
                        <p className='emphasized'>4</p>
                        <p>%</p>
                    </div>
                </div>

                <div className='stat'>
                    <div className='left'>
                        <p className='emphasized'>Protein</p>
                        <p>19g</p>
                    </div>
                </div>

            </div>

            <div className='vitamins'>

                <div className='stat'>
                    <p>Vitamin D 0mcg</p>
                    <p>0%</p>
                </div>

                <div className='stat'>
                    <p>Calcium 136mcg</p>
                    <p>14%</p>
                </div>

                <div className='stat'>
                    <p>Iron 2mg</p>
                    <p>10%</p>
                </div>

                <div className='stat'>
                    <p>Potassium 430mcg</p>
                    <p>12%</p>
                </div>
            </div>

        </div>
    )
}
export default NutritionFacts;