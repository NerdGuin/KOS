from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

router = APIRouter(prefix="/api/radio", tags=["radio"])


class RadioStation(BaseModel):
    id: str
    name: str
    frequency: str
    genre: str
    stream_url: HttpUrl
    website: Optional[HttpUrl] = None
    logo_url: Optional[HttpUrl] = None
    description: Optional[str] = None


class RadioSelection(BaseModel):
    station: RadioStation
    selected: bool


stations: List[RadioStation] = [
    RadioStation(
        id="mix-rio",
        name="Mix Rio",
        frequency="102.1",
        genre="Top 40",
        stream_url="http://26563.live.streamtheworld.com/MIXRIOAAC_SC",
        website="https://mixriofm.com.br/",
        description="Estação pop com os maiores hits do momento.",
    ),
    RadioStation(
        id="jb-fm",
        name="JB FM",
        frequency="99.9",
        genre="News",
        stream_url="https://26573.live.streamtheworld.com/JBFMAAC.aac",
        website="https://jb.fm/",
        description="Notícias, esportes e entretenimento 24 horas.",
    ),
]

station_by_id: Dict[str, RadioStation] = {station.id: station for station in stations}
current_station_id: Optional[str] = None


@router.get("/stations", response_model=List[RadioStation])
def list_radio_stations():
    """Retorna todas as estações de rádio disponíveis."""
    return stations


@router.get("/stations/current", response_model=Optional[RadioStation])
def current_radio_station():
    """Retorna a estação atualmente selecionada."""
    if current_station_id is None:
        return None
    return station_by_id.get(current_station_id)


@router.get("/select/{station_id}", response_model=RadioSelection)
def select_radio_station(station_id: str):
    """Seleciona uma estação de rádio pelo ID."""
    global current_station_id
    station = station_by_id.get(station_id)
    if station is None:
        raise HTTPException(status_code=404, detail="Estação de rádio não encontrada")

    current_station_id = station_id
    return RadioSelection(station=station, selected=True)
