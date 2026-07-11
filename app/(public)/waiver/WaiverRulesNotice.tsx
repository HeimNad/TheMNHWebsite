export function WaiverRulesNotice() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8 mb-8 space-y-6">
      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
        <p className="text-pink-700 font-medium text-sm">
          <span className="font-bold">NOTICE:</span> This Waiver and Release
          of Liability Agreement is a legal document that limits and affects
          your rights. Please read carefully before submitting.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-pink-700 mb-4">
          The MNH Wonder Rides Rules
        </h2>
        <ul className="space-y-2 text-pink-700 list-disc pl-5">
          <li>
            Riders under 4 ft. must be accompanied on all rides by an adult
          </li>
          <li>Max weight limit: 250 lbs per animal ride</li>
          <li>No food or drinks while riding</li>
          <li>
            Riders may not go into stores or exit the mall during the ride
          </li>
          <li>No bumping into people or other riders</li>
          <li>All children must be supervised by an adult</li>
        </ul>
      </div>

      <div className="space-y-4 text-pink-700 text-sm leading-relaxed">
        <p>
          This Personal Injury Waiver (“Waiver”) is made by the undersigned
          for the purpose of participating in ride activities operated by The
          MNH Company LLC (the “Company”). The undersigned acknowledges and
          accepts that there are inherent risks of personal injury related to
          the use of the ride-on animals provided.
        </p>
        <p>
          In consideration of being allowed to participate in these
          activities at the selected location (listed below), the undersigned
          voluntarily assumes all known and unknown risks and agrees to
          release, discharge, and hold harmless the Company, its owners,
          staff, affiliates, and partners from any and all claims,
          liabilities, damages, or losses arising from participation,
          including but not limited to any injuries, theft, accidents, or
          negligence.
        </p>
        <p>
          This Waiver shall be binding upon the undersigned and their heirs,
          legal representatives, successors, and assigns. If any portion of
          this Waiver is deemed invalid, the remaining provisions shall
          remain fully enforceable.
        </p>
      </div>
    </div>
  );
}
