from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.quotations import router as quotations_router


app = FastAPI(
    title="Odoo x GCET - Rental Management",
    version="1.0.0",
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(admin_router, prefix="/api")
app.include_router(quotations_router)

@app.get("/")
async def root():
    return {"message": "FastAPI Server is running 🚀"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}