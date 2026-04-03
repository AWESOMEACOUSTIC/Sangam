import { useCallback, useEffect } from "react";
import { useClerk, useUser } from "@clerk/react";
import { useLocation, useNavigate } from "react-router-dom";

const BOOKING_REDIRECT_KEY = "sangam.booking.redirectPath";

function normalizePath(path = "") {
	const normalizedPath = String(path).trim().replace(/\/+$/, "");
	return normalizedPath || "/";
}

function getCurrentPath(location) {
	return `${location.pathname}${location.search}${location.hash}`;
}

function getStorage() {
	if (typeof window === "undefined") return null;
	return window.sessionStorage;
}

export default function useBookingAuthGate() {
	const { user, isLoaded } = useUser();
	const { openSignIn } = useClerk();
	const location = useLocation();
	const navigate = useNavigate();

	const setPendingRedirectPath = useCallback((path) => {
		const storage = getStorage();
		if (!storage) return;
		storage.setItem(BOOKING_REDIRECT_KEY, normalizePath(path));
	}, []);

	const getPendingRedirectPath = useCallback(() => {
		const storage = getStorage();
		if (!storage) return "";
		return storage.getItem(BOOKING_REDIRECT_KEY) || "";
	}, []);

	const clearPendingRedirectPath = useCallback(() => {
		const storage = getStorage();
		if (!storage) return;
		storage.removeItem(BOOKING_REDIRECT_KEY);
	}, []);

	const requestAuthentication = useCallback(
		(targetPath) => {
			const fallbackPath = getCurrentPath(location);
			const resolvedTargetPath = targetPath || fallbackPath;

			setPendingRedirectPath(resolvedTargetPath);
			openSignIn();
		},
		[location, openSignIn, setPendingRedirectPath]
	);

	const ensureAuthenticated = useCallback(
		(targetPath) => {
			if (!isLoaded) return false;

			if (user) {
				return true;
			}

			requestAuthentication(targetPath);
			return false;
		},
		[isLoaded, requestAuthentication, user]
	);

	useEffect(() => {
		if (!isLoaded || !user) return;

		const pendingRedirectPath = getPendingRedirectPath();
		if (!pendingRedirectPath) return;

		clearPendingRedirectPath();

		const currentPath = normalizePath(getCurrentPath(location));
		const normalizedPendingPath = normalizePath(pendingRedirectPath);

		if (normalizedPendingPath !== currentPath) {
			navigate(normalizedPendingPath, { replace: true });
		}
	}, [
		clearPendingRedirectPath,
		getPendingRedirectPath,
		isLoaded,
		location,
		navigate,
		user,
	]);

	return {
		isAuthLoaded: isLoaded,
		isAuthenticated: Boolean(user),
		ensureAuthenticated,
		requestAuthentication,
	};
}
