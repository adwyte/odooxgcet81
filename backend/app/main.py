from fastapi import FastAPI

app = FastAPI(
    title="Odoo x GCET",
    version="1.0.0",
)

@app.get("/")
async def root():
    return {"message": "FastAPI Server is running 🚀"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}