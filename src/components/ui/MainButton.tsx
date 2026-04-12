interface MainButtonProps {
  text:string,
  className:string,
  disabled?:boolean,
  type?: "button" | "submit" | "reset"
  onClick?: () => void;
}

const MainButton  = ({text,className,disabled=false,type="button",onClick}:MainButtonProps) => {
  return (
    <>
    <button className={className} disabled={disabled} type={type} onClick={onClick}>
      {text}
    </button>
    </>  
 
  )
}

export default MainButton;