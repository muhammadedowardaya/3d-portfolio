const renderContent: Record<number, JSX.Element> = {
	1: <h1>1</h1>,
	2: <h1>2</h1>,
	3: <h1>3</h1>,
	4: <h1>4</h1>,
	5: <h1>5</h1>,
};

const HomeInfo = ({ currentStage }: { currentStage: number }) => {
	return renderContent[currentStage];
};

export default HomeInfo;
