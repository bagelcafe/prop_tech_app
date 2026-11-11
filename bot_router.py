"""/api/bot/* — 매도 보호(trailing stop) 봇 REST 라우터.

설계: TRAILING_BOT_DESIGN.md §8
등록/조회/승인(confirm)/거절(reject)/해제(cancel)/긴급정지(halt)/재개(resume).
"""
from fastapi import APIRouter, HTTPException, Path, Response
from pydantic import BaseModel, Field
from typing import Optional

import trailing_bot

router = APIRouter(prefix="/api/bot", tags=["trailing-bot"])


class StopRegisterInput(BaseModel):
    account_seq: int = Field(..., ge=0)
    symbol: str = Field(..., min_length=1, max_length=30, pattern=r"^[A-Za-z0-9.\-]+$")
    quantity: str = Field(..., pattern=r"^\d+(\.\d+)?$")
    name: Optional[str] = Field(None, max_length=50)
    peak_override: Optional[str] = Field(None, pattern=r"^\d+(\.\d+)?$")
    dry_run: Optional[bool] = None


@router.post("/stops")
def register_stop(payload: StopRegisterInput):
    try:
        return trailing_bot.bot.register(
            account_seq=payload.account_seq, symbol=payload.symbol, quantity=payload.quantity,
            name=payload.name, peak_override=payload.peak_override, dry_run=payload.dry_run)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from None


@router.get("/stops")
def list_stops(response: Response):
    response.headers["Cache-Control"] = "no-store"
    return {"items": trailing_bot.bot.list_all()}


@router.get("/pending-confirms")
def pending_confirms(response: Response):
    response.headers["Cache-Control"] = "no-store"
    return {"items": trailing_bot.bot.pending_confirms()}


@router.post("/stops/{stop_id}/confirm")
def confirm_stop(stop_id: int = Path(..., ge=1)):
    try:
        return trailing_bot.bot.confirm(stop_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from None


@router.post("/stops/{stop_id}/reject")
def reject_stop(stop_id: int = Path(..., ge=1)):
    try:
        return trailing_bot.bot.reject(stop_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from None


@router.delete("/stops/{stop_id}")
def cancel_stop(stop_id: int = Path(..., ge=1)):
    try:
        return trailing_bot.bot.cancel(stop_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from None


@router.post("/halt")
def halt():
    return trailing_bot.bot.halt()


@router.post("/resume")
def resume():
    return trailing_bot.bot.resume()
