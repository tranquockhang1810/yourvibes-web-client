import MyHeader from "@/components/common/header/view/Header";

export default function layout({ children }: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <div className="mb-10">
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1 }}>
                <MyHeader />
            </div>
            <div style={{ paddingTop: '60px' }}>
                {children}
            </div>
        </div>
    );
}