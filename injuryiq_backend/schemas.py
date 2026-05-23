from pydantic import BaseModel, Field
from typing import List, Optional

class SymptomsSchema(BaseModel):
    painLevel: int = Field(..., ge=0, le=10)
    painType: str
    painIncreases: List[str] = []
    painReliefWithMeds: str
    swelling: str
    bruising: str
    deformity: str
    skinColor: str
    tightTense: bool
    movementAbility: str
    sideComparison: str

class OttawaSchema(BaseModel):
    canWalkImmediately: bool = True
    canWalkNow: bool = True
    lateralMalleolusTenderness: bool = False
    medialMalleolusTenderness: bool = False
    fifthMetatarsalTenderness: bool = False
    navicularTenderness: bool = False
    patellarTenderness: bool = False
    fibularHeadTenderness: bool = False
    kneeFlexion90: bool = True
    snuffboxTenderness: bool = False
    scaphoidTubercleTenderness: bool = False
    thumbCompressionPain: bool = False
    gripPain: bool = False

class RedFlagsSchema(BaseModel):
    boneProtruding: bool = False
    numbnessBelow: bool = False
    blueColdBelow: bool = False
    unrelivedPain: bool = False

class AssessmentRequest(BaseModel):
    userId: str
    injuryArea: str
    age: int
    injuryTimeAgo: str
    howInjured: str
    soundHeard: str
    symptoms: SymptomsSchema
    ottawaResults: OttawaSchema
    redFlags: RedFlagsSchema
    imageUrl: Optional[str] = None
    comparisonImageUrl: Optional[str] = None
    lang: str = "en"  # language preference for generated recommendation text ('en', 'hi', 'hn')

class ScoreBreakdownItem(BaseModel):
    factor: str
    points: int

class RecommendationActions(BaseModel):
    level: str
    title: str
    actions: List[str]

class AssessmentResponse(BaseModel):
    assessmentId: str
    userId: str
    injuryArea: str
    riskScore: int
    riskLevel: str
    scoreBreakdown: List[ScoreBreakdownItem]
    recommendations: RecommendationActions
    imageUrl: Optional[str] = None
    comparisonImageUrl: Optional[str] = None
    createdAt: str

class RegisterNotifyRequest(BaseModel):
    email: str
    name: str

class RegisterNotifyResponse(BaseModel):
    success: bool
    message: str
    domain_verified: bool

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[dict] = None
