interface MainButtonProps {
  text:string,
  className:string,
  disabled?:boolean,
  style?: React.CSSProperties,
  type?: "button" | "submit" | "reset"
onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const MainButton  = ({text,className,disabled=false,type="button",onClick,style}:MainButtonProps) => {
  return (
    <>
    <button className={className} disabled={disabled} type={type} onClick={onClick} style={style}>
      {text}
    </button>
    </>  
 
  )
}

export default MainButton;