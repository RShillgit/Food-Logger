import { useEffect, useState } from 'react';
import '../styles/nutritionFacts.css';

const NutritionFacts = (props) => {

    const [quantity, setQuantity] = useState(1);

    // Anytime the quantity changes render new values
    useEffect(() => {

    }, [quantity])

    return (
        <div className="nutritionFacts">
            {props.facts
                ?
                <> 
                    <div className="title">
                        <h1>Nutrition Facts</h1>
                    </div>

                    <div className="servings">
                        <p>Serving</p>
                        <input value={quantity} type="number" min="1" onChange={(e) => setQuantity(e.target.value)}/>
                        <p>{quantity} {props.measurement}</p>
                    </div>

                    <div className="calories">
                        <p>Calories</p>
                        <p>{Math.round(props.facts.calories * quantity)}</p>
                    </div>

                    <div className='mainNutrients'>

                        <p className='title'>% Daily Value*</p>

                        {(props.facts.totalNutrients.FAT)
                            ? 
                            <div className='stat'>
                                <div className='left'>
                                    <p className='emphasized'>Total Fat</p>
                                    <p>{Math.round(props.facts.totalNutrients.FAT.quantity * quantity)}{props.facts.totalNutrients.FAT.unit}</p>
                                </div>
                                <div className='right'>
                                    <p className='emphasized'>{Math.round(props.facts.totalDaily.FAT.quantity * quantity)}</p>
                                    <p>%</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.FASAT)
                            ?
                            <div className='stat'>
                                <div className='left indented'>
                                    <p>Saturated Fat</p>
                                    <p>{Math.round(props.facts.totalNutrients.FASAT.quantity * quantity)}{props.facts.totalNutrients.FASAT.unit}</p>
                                </div>
                                <div className='right'>
                                    <p className='emphasized'>{Math.round(props.facts.totalDaily.FASAT.quantity * quantity)}</p>
                                    <p>%</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.FATRN)
                            ?
                            <div className='stat'>
                                <div className='left indented'>
                                    <p>Trans Fat</p>
                                    <p>{Math.round(props.facts.totalNutrients.FATRN.quantity * quantity)}{props.facts.totalNutrients.FATRN.unit}</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.FAPU)
                            ?
                            <div className='stat'>
                                <div className='left indented'>
                                    <p>Polyunsaturated Fat</p>
                                    <p>{Math.round(props.facts.totalNutrients.FAPU.quantity * quantity)}{props.facts.totalNutrients.FAPU.unit}</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.FAMS)
                            ?
                            <div className='stat'>
                                <div className='left indented'>
                                    <p>Monounsaturated Fat</p>
                                    <p>{Math.round(props.facts.totalNutrients.FAMS.quantity * quantity)}{props.facts.totalNutrients.FAMS.unit}</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.CHOLE)
                            ?
                            <div className='stat'>
                                <div className='left'>
                                    <p className='emphasized'>Cholesterol</p>
                                    <p>{Math.round(props.facts.totalNutrients.CHOLE.quantity * quantity)}{props.facts.totalNutrients.CHOLE.unit}</p>
                                </div>
                                <div className='right'>
                                    <p className='emphasized'>{Math.round(props.facts.totalDaily.CHOLE.quantity * quantity)}</p>
                                    <p>%</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.NA)
                            ?
                            <div className='stat'>
                                <div className='left'>
                                    <p className='emphasized'>Sodium</p>
                                    <p>{Math.round(props.facts.totalNutrients.NA.quantity * quantity)}{props.facts.totalNutrients.NA.unit}</p>
                                </div>
                                <div className='right'>
                                    <p className='emphasized'>{Math.round(props.facts.totalDaily.NA.quantity * quantity)}</p>
                                    <p>%</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.CHOCDF)
                            ?
                            <div className='stat'>
                                <div className='left'>
                                    <p className='emphasized'>Total Carbohydrate</p>
                                    <p>{Math.round(props.facts.totalNutrients.CHOCDF.quantity * quantity)}{props.facts.totalNutrients.CHOCDF.unit}</p>
                                </div>
                                <div className='right'>
                                    <p className='emphasized'>{Math.round(props.facts.totalDaily.CHOCDF.quantity * quantity)}</p>
                                    <p>%</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.FIBTG)
                            ?
                            <div className='stat'>
                                <div className='left indented'>
                                    <p>Dietary Fiber</p>
                                    <p>{Math.round(props.facts.totalNutrients.FIBTG.quantity * quantity)}{props.facts.totalNutrients.FIBTG.unit}</p>
                                </div>
                                <div className='right'>
                                    <p className='emphasized'>{Math.round(props.facts.totalDaily.FIBTG.quantity * quantity)}</p>
                                    <p>%</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.SUGAR)
                            ?
                            <div className='stat sugar'>
                                <div className='left'>
                                    <p>Total Sugars</p>
                                    <p>{Math.round(props.facts.totalNutrients.SUGAR.quantity * quantity)}{props.facts.totalNutrients.SUGAR.unit}</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients["SUGAR.added"] )
                            ?
                            <div className='stat addedSugar'>
                                <div className='left'>
                                    <p>Includes {Math.round(props.facts.totalNutrients["SUGAR.added"].quantity * quantity)}{props.facts.totalNutrients["SUGAR.added"].unit} Added Sugars</p>
                                </div>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.PROCNT)
                            ?
                            <div className='stat'>
                                <div className='left'>
                                    <p className='emphasized'>Protein</p>
                                    <p>{Math.round(props.facts.totalNutrients.PROCNT.quantity * quantity)}{props.facts.totalNutrients.PROCNT.unit}</p>
                                </div>
                            </div>
                            :<></>
                        }
                    </div>

                    <div className='vitamins'>
                        {(props.facts.totalNutrients.VITD)
                            ?
                            <div className='stat'>
                                <p>Vitamin D {Math.round(props.facts.totalNutrients.VITD.quantity * quantity)}{props.facts.totalNutrients.VITD.unit}</p>
                                <p>{Math.round(props.facts.totalDaily.VITD.quantity * quantity)}%</p>
                            </div>
                            :<></>
                        }
                        {(props.facts.totalNutrients.CA)
                            ?
                            <div className='stat'>
                                <p>Calcium {Math.round(props.facts.totalNutrients.CA.quantity * quantity)}{props.facts.totalNutrients.CA.unit}</p>
                                <p>{Math.round(props.facts.totalDaily.CA.quantity * quantity)}%</p>
                            </div>
                            :
                            <div className='stat'>
                                <p>Calcium 0mcg</p>
                                <p>0%</p>
                            </div>
                        }
                        {(props.facts.totalNutrients.FE)
                            ?
                            <div className='stat'>
                                <p>Iron {Math.round(props.facts.totalNutrients.FE.quantity * quantity)}{props.facts.totalNutrients.FE.unit}</p>
                                <p>{Math.round(props.facts.totalDaily.FE.quantity * quantity)}%</p>
                            </div>
                            :
                            <div className='stat'>
                                <p>Iron 0mg</p>
                                <p>0%</p>
                            </div>
                        }
                        {(props.facts.totalNutrients.K)
                            ?
                            <div className='stat'>
                                <p>Potassium {Math.round(props.facts.totalNutrients.K.quantity * quantity)}{props.facts.totalNutrients.K.unit}</p>
                                <p>{Math.round(props.facts.totalDaily.K.quantity * quantity)}%</p>
                            </div>
                            :
                            <div className='stat'>
                                <p>Potassium 0mcg</p>
                                <p>0%</p>
                            </div>
                        }
                    </div>

                    <button onClick={() => {
                        const stats = {
                            calories: Math.round(props.facts.calories * quantity),
                            carbs: Math.round(props.facts.totalNutrients.CHOCDF.quantity * quantity),
                            fats: Math.round(props.facts.totalNutrients.FAT.quantity * quantity),
                            proteins: Math.round(props.facts.totalNutrients.PROCNT.quantity * quantity),
                            quantity: quantity,
                            units: props.measurement
                        }

                        props.logFoodItem(props.facts, stats)
                    }}>Log Food</button>
                </>
                :<></>
            }
        </div>
    )
}
export default NutritionFacts;