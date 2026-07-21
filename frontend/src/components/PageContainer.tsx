import type { ReactNode } from "react";

function PageContainer({ children }: { children: ReactNode }) {
    return (
        <div style={{height: "100vh", width: "100%"}}>
            {children}
        </div>
    )
}

export default PageContainer;