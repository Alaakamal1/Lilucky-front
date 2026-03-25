interface MainButtonProps {
  text:string,
  className:string,
  disabled?:boolean,
   type?: "button" | "submit" | "reset"
}

const MainButton  = ({text,className,disabled=false,type="button"}:MainButtonProps) => {
  return (
    <>
    <button className={className} disabled={disabled} type={type}>
      {text}
    </button>
    </>  
 
  )
}

export default MainButton;