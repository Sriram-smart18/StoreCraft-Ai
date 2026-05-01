type NextContext = { params: Promise<{ id: string }> }; const nextHandler: (ctx: NextContext) => void = (ctx: { params: { id: string } | any }) => {};
