

const Form =  ({keyy, setKey})=>{
   return(
    <div>
         <p>{keyy}</p>
                 <button onClick={()=> setKey(keyy+1)}>
          increment
        </button>
       <h1>Hello World</h1>
      
    </div>
   
   )
}

export default Form;