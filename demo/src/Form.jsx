

const Form =  ({keyy, setKey})=>{
   return(
<div className="flex flex-col items-center justify-center gap-4 p-6 bg-red-500 text-white rounded-lg shadow-md">
  <p className="text-lg font-medium">Key: {keyy}</p>

  <button
    onClick={() => setKey(keyy + 1)}
    className="px-4 py-2 bg-white text-red-500 font-semibold rounded hover:bg-red-100 transition"
  >
    Increment
  </button>

  <h1 className="text-2xl font-bold">Hello World</h1>
</div>

   
   )
}

export default Form;