import MyHeader from "@/components/common/header/view/Header";

export default function layout({ children }: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <div className="mb-10">
            <MyHeader/> 
            {children}
        </div>
       
        
    );
}