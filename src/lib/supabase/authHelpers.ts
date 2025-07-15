import { NextResponse } from "next/server";

/** authorize 라이브러리 함수를 호출한 결과의 인가 승인 여부, 비인가 시의 응답 객체, 인가된 사용자 정보 등을 반환하는 사용자 정의 자료형 */
export type AuthResult = {
    granted: boolean,
    response?: NextResponse,
    user?: any
}

/** authorize 라이브러리 함수에서만 사용하는 user 테이블 및 profiles 테이블 조회 담당 서브루틴  */
async function getUserAndProfile(supabase: any, token: string): Promise<{ profile: any; user: any; } | null> {
    // 토큰으로 supabase에서 사용자 반환
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return null;
    // 사용자 id로 supabase에서 프로필 조회
    const { data: profile, error } = await supabase.from("profiles").select().eq('id', user.id).single();
    console.log(profile.service_role);
    if (error) return null;

    return { user, profile };
}

/** api route의 핸들러 메서드에서 호출할 수 있는, 요청에 담긴 인증 정보와 필요한 권한이 일치하는 지 확인하는 라이브러리 메서드. 결과 객체의 내용에 따른 처리가 필요하다. */
export async function authorize(request: Request, supabase: any, role?: string): Promise<AuthResult> {
    const NextResNoAuth = NextResponse.json({ error: '로그인 후 사용해 주세요.' }, { status: 401 });
    const NextResNoProf = NextResponse.json({ error: '사용자 권한 정보를 조회할 수 없습니다.' }, { status: 403 });
    const NextResNoPerm = NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });

    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return { granted: false, response: NextResNoAuth };

    const uap = await getUserAndProfile(supabase, token);
    if (!uap) return { granted: false, response: NextResNoProf };

    const { user, profile } = uap;
    if (role && profile.service_role !== role) return { granted: false, response: NextResNoPerm };

    return { granted: true, user: user };
}