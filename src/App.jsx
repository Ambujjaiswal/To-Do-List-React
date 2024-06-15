import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


function App() {
  // create a state for todo which is the input text
  const [todo, settodo] = useState("")
  // it handles the array of todo list
  const [todos, settodos] = useState([])

  const [showfinished, setshowfinished] = useState(false)

  // to show case the saved todos for the first time
  useEffect(() => {
    let todostring = localStorage.getItem("todos")
    if (todostring) {
      let todos = JSON.parse(localStorage.getItem("todos"))
      settodos(todos)
    }
  }, [])

  // to save to local storage
  const SaveToLS = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id)
    settodo(t[0].todo)
    const newTodos = todos.filter((item) => item.id !== id);
    settodos(newTodos);
    SaveToLS(newTodos);
  }

  // The handleDelete function now accepts an id parameter and filters out the todo item with the matching id from the todos state.
  const handleDelete = (id) => {
    // Filter out the todo item that has the same id
    const newTodos = todos.filter((item) => item.id !== id);
    settodos(newTodos);
    SaveToLS(newTodos);
  }

  const handleAdd = () => {
    if (todo.trim() !== "") {
      //basically todos ko pakdo that is wo list ko aur usko ek array se initialize krdo
      // jisme do variable h todo and isCompleted and ek id de rkha h jo uuid (kind of api) se initialize hora h
      const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
      settodos(newTodos);
      //kuch type kru uske baad wapas empty krdo text box ko
      settodo("")
      console.log(todos)
      SaveToLS(newTodos);
    }
  }

  const handleChange = (e) => {
    settodo(e.target.value)
  }

  // This function takes the id of a todo item and toggles(changes) its isCompleted state. It updates the todos state by mapping over the existing todos and updating the specific todo item.
  const handleCheckboxChange = (id) => {
    // Toggle the isCompleted status of the todo item
    const newTodos = todos.map((item) =>
      // basically pehle jis id se trigger hua h ye function wo mila
      // uske baad uske item ko pakdo and true h toh false krdo and vice versa 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    settodos(newTodos);
    SaveToLS(newTodos);
  }

  const toggleFinished =(e)=>{
    setshowfinished(!showfinished)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  }

  return (
    <>
      <Navbar />
      {/* In Tailwind CSS, the md: prefix is used for applying responsive design utility classes at a specific breakpoint. The md: prefix applies the given styles at the medium screen size and up. Tailwind CSS defines md as a breakpoint for screens that are 768px and wider. */}
      <div className="mx:3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
      <h1 className="font-bold text-center text-xl">iTask - Manage Your Todos At One Place</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Add a Todo</h2>
          <input onChange={handleChange} onKeyDown={handleKeyDown} value={todo} type="text" className='w-full rounded-lg px-5 py-1' />

          <button onClick={handleAdd} disabled={todo.length<=3} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md ">Add</button>
        </div>

        <input className='my-4' onChange={toggleFinished} type="checkbox" checked={showfinished} id="" /> Show Finished

        <h2 className="text-lg font-bold">Your Todos</h2>

        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No todos to display</div>}
          {todos.map((item) => {
            return ( (showfinished || !item.isCompleted) && <div key={item.id} className="todo flex justify-between items-center p-2 border-b border-gray-200">
               {/* // har todo list m jo apan daalnge uski ek unique id hogi jisse hum usko call krnge */}

                <div className='flex gap-5'>
                  {/* ye waala div checkbox aur aur line ko paas laane k liye h  */}

                  {/* Checkbox to toggle completion */}
                  {/* A checkbox input element is added before each todo item. Its checked attribute is set based on the isCompleted state, and the onChange event calls handleCheckboxChange with the item's id. */}
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => handleCheckboxChange(item.id)}
                  />

                  {/* line m cross krne k liye isCompleted variable ko rkha h  */}
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>

                </div>

                {/* button  */}
                <div className="buttons flex h-full">
                  <button onClick={(e) => handleEdit(e, item.id)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"><MdDelete /></button>

                </div>
              </div>
            )

          })}

        </div>
      </div>
    </>
  )
}

export default App
