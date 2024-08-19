import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'


import { categories } from "../data/categories"
import { Activity } from "../types"
import { useActivity } from "../hooks/useActivity"




const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: '',
  calories: 0
}

export default function Form() {

  const { state, dispatch } = useActivity()
  

  const [activity, setActivity] = useState<Activity>(initialState)

  useEffect(() => {
    if(state.activeId) {
      const selectActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId) [0]
      setActivity(selectActivity)
    }
  }, [state.activeId])

  const handleChange = (e : React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {

    const isNumberField = ['category', 'calories'].includes(e.target.id)

    setActivity({
      ...activity,
      [e.target.id]: isNumberField ? parseInt(e.target.value) : e.target.value
    })
  }
  
  const isValidActivity = () => {
    const { name, calories } = activity
    return name.trim() !== '' && calories > 0
  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    dispatch({ type: 'save-activity', payload: { newActivity: activity } })

    setActivity({
      ...initialState,
      id: uuidv4()
    })
  }

  return (
    <form 
      className="space-y-5 bg-white p-10 shadow rounded-lg" 
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="category" className="font-bold">Categoría:</label>
        <select 
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          name="" 
          id="category"
          value={activity.category}
          onChange={handleChange}
        >
          {categories.map(category => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name" className="font-bold">Actividad:</label>
        <input
          type="text"
          id="name"
          className="border border-slate-300 p-2 rounded-lg w-full"  
          placeholder="Ejemplo: Comida, Jugo de Naranja, Ensalada, Ejercicio, Trotar, Bicicleta"
          value={activity.name}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories" className="font-bold">Calorías:</label>
        <input
          type="number"
          id="calories"
          name="calories"
          className="border border-slate-300 p-2 rounded-lg w-full"  
          placeholder="Calorias. Ejemplo: 200, 300, etc"
          value={activity.calories}
          onChange={handleChange}
        />
      </div>

      <input 
        type="submit" 
        className="bg-gray-800 hover:bg-gray-900 w-full p-2 text-white cursor-pointer uppercase disabled:opacity-20"
        value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
        disabled={!isValidActivity()}
      />
    </form>
  )
}
