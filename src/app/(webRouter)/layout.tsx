import MyHeader from "@/components/common/header/view/Header";

export default function layout({ children }: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <div className="mb-10">
                <MyHeader />
            <div style={{ paddingTop: '60px', paddingLeft: '53px'}}>
                {children}
            </div>
        </div>
    );
}